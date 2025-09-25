
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }


  }

  return NextResponse.json({ received: true })
}


